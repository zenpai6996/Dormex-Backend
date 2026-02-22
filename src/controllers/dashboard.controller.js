import Block from "../models/Block.js";
import Complaint from "../models/Complaint.js";
import MessMenu from "../models/MessMenu.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
// export const getDashboardAnalytics = async (req, res) => {
// 	try {
// 		// Students
// 		const totalStudents = await User.countDocuments({ role: "STUDENT" });
// 		const activeStudents = await User.countDocuments({
// 			role: "STUDENT",
// 			status: "ACTIVE",
// 		});

// 		// Rooms
// 		const totalRooms = await Room.countDocuments();
// 		const occupiedRooms = await Room.countDocuments({
// 			occupants: { $exists: true, $not: { $size: 0 } },
// 		});
// 		const vacantRooms = totalRooms - occupiedRooms;

// 		// Complaints
// 		const totalComplaints = await Complaint.countDocuments();
// 		const openComplaints = await Complaint.countDocuments({ status: "OPEN" });
// 		const inProgressComplaints = await Complaint.countDocuments({
// 			status: "IN_PROGRESS",
// 		});
// 		const resolvedComplaints = await Complaint.countDocuments({
// 			status: "RESOLVED",
// 		});

// 		// Today's menu
// 		const today = new Date().toLocaleString("en-US", { weekday: "long" });
// 		const todayMenu = await MessMenu.findOne({ day: today });

// 		res.json({
// 			students: {
// 				total: totalStudents,
// 				active: activeStudents,
// 			},
// 			rooms: {
// 				total: totalRooms,
// 				occupied: occupiedRooms,
// 				vacant: vacantRooms,
// 			},
// 			complaints: {
// 				total: totalComplaints,
// 				open: openComplaints,
// 				inProgress: inProgressComplaints,
// 				resolved: resolvedComplaints,
// 			},
// 			todayMenu,
// 		});
// 	} catch (err) {
// 		res
// 			.status(500)
// 			.json({ message: "Dashboard analytics error", error: err.message });
// 	}
// };

export const getDashboardAnalytics = async (req, res) => {
	try {
		const today = new Date().toLocaleString("en-US", {
			weekday: "long",
		});

		const todayMenu = await MessMenu.findOne({ day: today });

		// =============================
		// STUDENT DASHBOARD
		// =============================
		if (req.user.role === "STUDENT") {
			const user = await User.findById(req.user.id)
				.populate("block")
				.populate("room");

			return res.json({
				role: "STUDENT",
				student: {
					id: user._id,
					name: user.name,
					email: user.email,
					status: user.status,
					block: user.block,
					room: user.room,
				},
				todayMenu,
			});
		}

		// =============================
		// ADMIN DASHBOARD
		// =============================
		if (req.user.role === "ADMIN") {
			const totalStudents = await User.countDocuments({ role: "STUDENT" });
			const activeStudents = await User.countDocuments({
				role: "STUDENT",
				status: "ACTIVE",
			});

			const totalRooms = await Room.countDocuments();
			const occupiedRooms = await Room.countDocuments({
				occupants: { $exists: true, $not: { $size: 0 } },
			});
			const vacantRooms = totalRooms - occupiedRooms;

			const totalComplaints = await Complaint.countDocuments();
			const openComplaints = await Complaint.countDocuments({ status: "OPEN" });
			const inProgressComplaints = await Complaint.countDocuments({
				status: "IN_PROGRESS",
			});
			const resolvedComplaints = await Complaint.countDocuments({
				status: "RESOLVED",
			});

			const blocks = await Block.find();

			const blockStats = await Promise.all(
				blocks.map(async (block) => {
					const studentsInBlock = await User.countDocuments({
						block: block._id,
					});

					const rooms = await Room.find({ block: block._id });

					const totalRoomsInBlock = rooms.length;
					const occupiedRoomsInBlock = rooms.filter(
						(room) => room.occupants.length > 0,
					).length;

					const vacantRoomsInBlock = totalRoomsInBlock - occupiedRoomsInBlock;

					const totalCapacity = rooms.reduce(
						(sum, room) => sum + (room.capacity || 0),
						0,
					);

					const occupiedSeats = rooms.reduce(
						(sum, room) => sum + room.occupants.length,
						0,
					);

					const availableSeats = totalCapacity - occupiedSeats;

					return {
						blockId: block._id,
						blockName: block.name,
						totalStudents: studentsInBlock,
						totalRooms: totalRoomsInBlock,
						occupiedRooms: occupiedRoomsInBlock,
						vacantRooms: vacantRoomsInBlock,
						totalCapacity,
						occupiedSeats,
						availableSeats,
						inviteCodeExpiresAt: block.inviteCodeExpiresAt,
					};
				}),
			);

			return res.json({
				role: "ADMIN",
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
				blocks: {
					total: blocks.length,
					blockStats,
				},
				todayMenu,
			});
		}

		return res.status(403).json({ message: "Unauthorized role" });
	} catch (err) {
		res.status(500).json({
			message: "Dashboard analytics error",
			error: err.message,
		});
	}
};
