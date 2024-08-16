import vehicleModel from "./vehicleModel.js";

const vehicleController = {
    createVehicle: async (req, res) => {
        req.body.email=req.user.user;
        try {
            const vehicle = new vehicleModel(req.body);
            const result = await vehicle.save();
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getAllVehicles: async (req, res) => {
        const { phoneNumber } = req.user;
        console.log(phoneNumber);
        try {
            const result = await vehicleModel.find({ phoneNumber: req.user.phoneNumber });
            res.status(200).send(result);
            console.log(result);
        } catch (error) {
            res.status(500).send(error);
        }
    },
    getVehicleByUid: async (req, res) => {
        console.log(req.body);
        const { uid } = req.body;
        try {
            const result = await vehicleModel.findOne({
                uniqueIdentification: uid,});
            console.log(result);
            return result;
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

export default vehicleController;
