import vehicleModel from "./vehicleModel.js";

const vehicleController = {
    createVehicle: async (req, res) => {
        try {
            const vehicle = new vehicleModel(req.body);
            const result = await vehicle.save();
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getAllVehicles: async (req, res) => {
        const { phoneNumber } = req.body;
        try {
            const result = await vehicleModel.find({ phoneNumber: req.user.phoneNumber });
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

export default vehicleController;
