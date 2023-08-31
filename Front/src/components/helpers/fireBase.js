
import Http from '../security/Http';
import url from "../../Development.json";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'

import {
    collection, addDoc, query, orderBy, getDocs, where, doc, setDoc, updateDoc, getDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getUserList = async (data) => {

    const docRef = collection(db, 'ChatUsers');
    const q = query(docRef,
        where('userID', '!=', data.userId),
        // where('chatWith', 'in', [data.userId])
    )
    const docSnap = await getDocs(q);
    const userListData = [];
    docSnap.forEach((doc) => {
        userListData.push({ ...doc.data(), id: doc.id });
    });

    return userListData;
}

const getMessagesFireBase = async (data) => {

    const docRef = collection(db, 'Chat', data.userId, data.oppositeUserID);
    const q = query(docRef, orderBy('createAt', 'asc'));
    const docSnap = await getDocs(q);
    const arrayStore = [];
    docSnap.forEach((doc) => {
        arrayStore.push({ ...doc.data(), id: doc.id });
    });
    return arrayStore;
}
const storeMessagesFireBase = async (data) => {
    const senderData = {
        sendBy: data.userId,
        sendTo: data.oppositeUserID,
        msg: data.msg,
        IsURL: data.IsURL,
        ImageUrl: data.ImageUrl,
        mediaType: data.mediaType,
        isReadMsg: false,
        createAt: new Date(),
    }
    try {
        await addDoc(collection(db, 'Chat', data.userId, data.oppositeUserID), senderData);
        await addDoc(collection(db, 'Chat', data.oppositeUserID, data.userId), senderData);
    } catch (err) {
        console.log(err);
    }

    // const docRef = doc(db, "ChatUsers", data.userId);
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //     // if (doc.lstmsgtime) {
    //     //     arrayLstMsgTime.push(doc.lstmsgtime);
    //     // }
    //     // if (doc.lstMsg) {
    //     //     arrayLstMsg.push(doc.lstMsg);
    //     // }
    //     // if (doc.chatWith) {
    //     //     arrayChatWith.push(doc.chatWith);
    //     // }
    // } else {
    //     console.log("No such document!");
    // }
    let oppositeArrayLstMsgTime = {};
    let oppositeArrayLstMsg = {};
    let oppositeArrayChatWith = [];

    oppositeArrayLstMsg[data.oppositeUserID] = data.msg;
    oppositeArrayLstMsgTime[data.oppositeUserID] = new Date();
    oppositeArrayChatWith.push(data.oppositeUserID);

    let oppositeDataUpdate = {
        lstmsgtime: oppositeArrayLstMsgTime,
        lstMsg: oppositeArrayLstMsg,
        chatWith: oppositeArrayChatWith,
    }
    await setDoc(doc(db, "ChatUsers", data.userId), oppositeDataUpdate, { merge: true });

    let userArrayLstMsgTime = {};
    let userArrayLstMsg = {};
    let userArrayChatWith = [];

    userArrayLstMsg[data.userId] = data.msg;
    userArrayLstMsgTime[data.userId] = new Date();
    userArrayChatWith.push(data.userId);

    let userDataUpdate = {
        lstmsgtime: userArrayLstMsgTime,
        lstMsg: userArrayLstMsg,
        chatWith: userArrayChatWith,
    }
    await setDoc(doc(db, "ChatUsers", data.oppositeUserID), userDataUpdate, { merge: true });




    return true;
}
const startChat = async (data) => {

    const docRef = doc(db, "ChatUsers", data.userId);
    const docSnap = await getDoc(docRef);
    let arrayChatWith = [];

    if (docSnap.exists()) {
        if (doc.chatWith) {
            arrayChatWith.push(doc.chatWith);
        }
        arrayChatWith.push(data.oppositeUserID);
        await updateDoc(doc(db, "ChatUsers", data.userId), {
            chatWith: arrayChatWith,
        });

    } else {
        console.log("No such document!");
    }

    // const senderData = {
    //     sendBy: data.userId,
    //     sendTo: data.oppositeUserID,
    //     msg: 'start chat',
    //     IsURL: false,
    //     ImageUrl: false,
    //     mediaType: "text",
    //     isReadMsg: false,
    //     createAt: new Date(),
    // }

    // try {
    //     await addDoc(collection(db, 'Chat', data.userId, data.oppositeUserID), senderData);
    // } catch (err) {
    //     console.log(err);
    // }


    return true;
}
const detailScreenGetOppositeUserData = async (data) => {
    const docRef = doc(db, "ChatUsers", data.userId);
    const docSnap = await getDoc(docRef);
    let userDetailArray = [];

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        userDetailArray.push(docSnap.data())
    } else {
        console.log("No such document!");
    }
    return userDetailArray;
}
const addAllFirebaseUser = async (data) => {

    await setDoc(doc(db, "ChatUsers", data._id), {
        email: data.email,
        userName: data.userName,
        userID: data._id,
        mobileNo: data.mobile_no,
        name: data.first_name + " " + data.last_name,
        profileImg: data.profile_photo,
        device_token: data.access_token,
        Type: data.type,
        status: true,
        createAt: new Date(),
    }, { capital: true }, { merge: true });

    return true;
}
const addFireBaseUSer = async () => {
    const newData = {
        email: JSON.parse(localStorage.getItem('profile')).email,
        userID: JSON.parse(localStorage.getItem('profile'))._id,
        userName: JSON.parse(localStorage.getItem('profile')).first_name + " " + JSON.parse(localStorage.getItem('profile')).last_name,
        mobileNo: JSON.parse(localStorage.getItem('profile')).mobile_no,
        name: JSON.parse(localStorage.getItem('profile')).first_name + " " + JSON.parse(localStorage.getItem('profile')).last_name,
        profileImg: JSON.parse(localStorage.getItem('profile')).profile_photo,
        Type: "3",
        device_token: localStorage.getItem('accessToken'),
        status: true,
        createAt: new Date(),
    }
    try {
        const docRef = doc(db, "ChatUsers", JSON.parse(localStorage.getItem('profile'))._id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await updateDoc(doc(db, "ChatUsers", JSON.parse(localStorage.getItem('profile'))._id), newData, { capital: true }, { merge: true });

        } else {
            await setDoc(doc(db, "ChatUsers", JSON.parse(localStorage.getItem('profile'))._id), newData, { capital: true }, { merge: true });

        }

    } catch (err) {
        console.log(err);
        console.log(err.message);
    }
    return true;
}

export {
    getUserList,
    getMessagesFireBase,
    storeMessagesFireBase,
    addFireBaseUSer,
    startChat,
    addAllFirebaseUser,
    detailScreenGetOppositeUserData,
};