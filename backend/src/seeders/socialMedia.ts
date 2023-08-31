'use strict';
require('dotenv').config({ path: 'F:/ebiztrait/structure/Backend' + '/.env' })
import SocialMedia from '../models/social-media-model';
import mongoose from 'mongoose';

const data = [
    {
        name: 'Facebook',
        value: 'www.facebook.com',
        is_active: true,
    },
    {
        name: 'Twitter',
        value: 'www.twitter.com',
        is_active: true,
    },
    {
        name: 'Linkedin',
        value: 'www.linkedin.com',
        is_active: true,
    },
   
]

const seedDB = async () => {
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        await SocialMedia.deleteMany({});
        await SocialMedia.create(data);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
