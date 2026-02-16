import MessMenu from "../models/MessMenu.js";

export const createMenu = async (req, res) => {
	const menu = await MessMenu.create(req.body);
	res.status(201).json(menu);
};

export const getMenu = async (req, res) => {
	const menu = await MessMenu.find();
	res.json(menu);
};

export const updateMenu = async (req, res) => {
	const menu = await MessMenu.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(menu);
};
