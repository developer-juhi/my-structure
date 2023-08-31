'use strict';
require('dotenv').config({ path: 'F:/ebiztrait/structure/Backend' + '/.env' })
import mongoose from 'mongoose';
import User from '../models/user-model';
import bcrypt from 'bcrypt';

const seedDB = async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        const password = "admin@123";
        const passwordhash: any = await bcrypt.hash(password, Number(10));

        // await User.deleteMany({});
        return await User.create([{
            first_name: 'Juhi',
            last_name: 'vendor',
            user_name: 'jm_vendor_modi',
            mobile_no: '7575030796',
            type: '2',
            email: 'vendor@admin.com',
            password: passwordhash,
            is_active: true,
            location: '{\"address\":\"Surat, Gujarat, India\",\"latitude\":21.1702401,\"longitude\":21.1702401}',
            profile_photo: 'https://maintenancemasters.s3.amazonaws.com/admin/1672840141072download%20%286%29.jpg',
            createdAt: new Date(),
            updated_at: new Date(),
        }],
        );
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
