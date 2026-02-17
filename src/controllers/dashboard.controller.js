import Complaint from "../models/Complaint.js";
import MessMenu from "../models/MessMenu.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const getDashboardAnalytics = async (req, res) => {
	try {
		// Students
		const totalStudents = await User.countDocuments({ role: "STUDENT" });
		const activeStudents = await User.countDocuments({
			role: "STUDENT",
			status: "ACTIVE",
		});

		// Rooms
		const totalRooms = await Room.countDocuments();
		const occupiedRooms = await Room.countDocuments({
			occupants: { $exists: true, $not: { $size: 0 } },
		});
		const vacantRooms = totalRooms - occupiedRooms;

		// Complaints
		const totalComplaints = await Complaint.countDocuments();
		const openComplaints = await Complaint.countDocuments({ status: "OPEN" });
		const inProgressComplaints = await Complaint.countDocuments({
			status: "IN_PROGRESS",
		});
		const resolvedComplaints = await Complaint.countDocuments({
			status: "RESOLVED",
		});

		// Today's menu
		const today = new Date().toLocaleString("en-US", { weekday: "long" });
		const todayMenu = await MessMenu.findOne({ day: today });

		res.json({
			students: {
				total: totalStudents,
				active: activeStudents,
			},
			rooms: {
				total: totalRooms,
				occupied: occupiedRooms,
				vacant: vacantRooms,
			},
			complaints: {
				total: totalComplaints,
				open: openComplaints,
				inProgress: inProgressComplaints,
				resolved: resolvedComplaints,
			},
			todayMenu,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Dashboard analytics error", error: err.message });
	}
};
