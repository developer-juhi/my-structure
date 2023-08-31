'use strict';
require('dotenv').config({ path: 'D:/ebizTrait/maintance-master-fresh/structure/Backend' + '/.env' })
import mongoose from 'mongoose';
import Admin from '../models/admin-model';
import Role from '../models/role-model';
import bcrypt from 'bcrypt';


const seedDB = async () => {
    if (process.env.MONGO_URI) {
        mongoose.set("strictQuery", false);

        await mongoose.connect(process.env.MONGO_URI);
        var roleData: any = await Role.findOne({ 'name': 'super_admin' });
        const password = "admin@123";
        const passwordhash: any = await bcrypt.hash(password,Number(10));

        await Admin.deleteMany({});
        return await Admin.create([{
            first_name: 'Admin',
            last_name: 'Admin',
            email: 'admin@admin.com',
            role_id: roleData._id,
            password: passwordhash,
            is_superadmin: 'yes',
            is_active: true,
            createdAt: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'juhi',
            last_name: 'modi',
            email: 'juhi@admin.com',
            role_id: roleData._id,
            password: passwordhash,
            is_superadmin: 'yes',
            is_active: true,
            createdAt: new Date(),
            updated_at: new Date(),
        }],
        );
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
