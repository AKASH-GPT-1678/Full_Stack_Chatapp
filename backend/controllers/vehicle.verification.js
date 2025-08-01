async function vehicleVerification(req, res) {
    const { vehicleId } = req.body;
    const vehicleIdVerfied = "9f8d3b50-2f37-4d8f-90b2-16f66d746f9b";

    try {

        if (vehicleId === vehicleIdVerfied) {
            return res.status(200).json({ status: true, message: "Vehicle is verified", id: vehicleIdVerfied });
        } else {
            res.status(400).json({ status: false, message: "Vehicle is not verified", id: vehicleId });

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });

    }

};

export default vehicleVerification;