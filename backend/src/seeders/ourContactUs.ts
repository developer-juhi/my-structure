'use strict';
require('dotenv').config({ path: 'F:/ebiztrait/structure/Backend' + '/.env' })
import OurContactUs from '../models/our-contact-us-model';
import mongoose from 'mongoose';

const contactUsData = [
    {
        key: 'email',
        value: 'juhi@gmail.com'
    },
    {
        key: 'contact_no',
        value: '123456789'
    },
    {
        key: 'location',
        value: '{"address":"Sydney NSW, Australia","latitude":-33.8688197,"longitude":-33.8688197}'
    },
    {
        key: 'website',
        value: 'www.google.com'
    },
    {
        key: 'admin_email',
        value: 'maintance.master.app@gmail.com'
    },
]

const seedDB = async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        await OurContactUs.deleteMany({});
        await OurContactUs.create(contactUsData);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
