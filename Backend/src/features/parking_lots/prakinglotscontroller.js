import ParkingLotModel from "./parkingLotsModel.js";

const parkingLotsController = {

    getParkingLots: async (req, res) => {
        try {
            const result = await ParkingLotModel.find();
            res.status(200).send(result);   
        } catch (error) {
            res.status(500).send(error);
        }
    },

    registerParkingLot: async (req, res) => {
        const { phoneNumber, name, maxCapacity ,occupancy, pincode  } = req.body;
        let space=[];
        for(let i=0;i<maxCapacity;i++){
            space.push({
                lotNo:i+1,
                occupied:false,
                bookingsDateWise:[],
                bookingsHourWise:[]
            });
        }
        let data={
            ownerPhoneNumber:phoneNumber,
            name:name,
            maxCapacity:maxCapacity,
            occupancy:occupancy,
            pincode:pincode,
            lots:space
        }
        try {
            const parkingLot = new ParkingLotModel(data);
            const result = await parkingLot.save();
            res.status(201).send(result);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
export default parkingLotsController;
