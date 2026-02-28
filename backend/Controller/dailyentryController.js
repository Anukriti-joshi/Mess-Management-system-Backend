import DailyEntry from "../Models/DailyEntry.js";
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'

export const getUserEntryDetail = asyncHandler(async (req , res) => {
    const userId = req.params.userId

    if(!userId)
    {
        return res.status(400).json({ message: 'User ID Required' })
    }

    let entry = await DailyEntry.findOne({"userId": parseInt(userId)})

    // If no DailyEntry exists for this user, create one
    if (!entry) {
        const today_date = new Date();
        today_date.setDate(today_date.getDate() - 1);
        const newEntry = new DailyEntry({
            userId: parseInt(userId),
            attendance: [{ date: today_date }]
        });
        entry = await newEntry.save();
    }

    res.json(entry);

}) 

export const updateDailyEntry = asyncHandler(async (req, res) => {
    const {userId , verifyThing , planId } = req.body

    if(!verifyThing)
    {
        return res.status(400).json({message:"Select type required"})
    }

    // Does the user exist to update?
    let user = await DailyEntry.findOne({"userId": parseInt(userId)}).exec()

    // If no DailyEntry exists, create one
    if (!user) {
        const today_date = new Date();
        today_date.setDate(today_date.getDate() - 1);
        const newEntry = new DailyEntry({
            userId: parseInt(userId),
            attendance: [{ date: today_date }]
        });
        user = await newEntry.save();
    }

    const date = new Date()
    const isTodayAdded = user.attendance.filter(item => {

        if( item.date.getDate()===date.getDate() && item.date.getMonth()===date.getMonth() && item.date.getYear()===date.getYear())
        {
            return item
        }
    });


    
    const length = isTodayAdded.length

    var updatedObject={}

    if(verifyThing==="breakfast")
    {
        updatedObject = {"breakfast":true , "lunch":length==0?false:isTodayAdded[0].menu.lunch , "dinner":length==0?false:isTodayAdded[0].menu.dinner }
    }
    else if(verifyThing==="lunch")
    {
        updatedObject = {"breakfast": length==0?false:isTodayAdded[0].menu.breakfast, "lunch":true , "dinner":length==0?false:isTodayAdded[0].menu.dinner }
        
    }
    else if(verifyThing==="dinner"){
        updatedObject = {"breakfast": length==0?false:isTodayAdded[0].menu.breakfast, "lunch":length==0?false:isTodayAdded[0].menu.lunch , "dinner":true }
    }
    else
    {
        // const updatedObject = {"breakfast": isTodayAdded[0].menu.breakfast, "lunch":isTodayAdded[0].menu.lunch , "dinner":true }
        return res.json({message :"No verify thing is access"})
    }
    

    if(isTodayAdded.length === 1)
    {
        if(((verifyThing==="breakfast")&&isTodayAdded[0].menu.breakfast)||((verifyThing==="lunch")&&isTodayAdded[0].menu.lunch) || ((verifyThing==="dinner")&&isTodayAdded[0].menu.dinner))
        {

            return res.status(400).json({message:`Your ${verifyThing} entry is already added`})
        }

        const updateEntry = await DailyEntry.updateOne({"userId":userId } , {
            $set:{
                "attendance.$[elemX].menu" : updatedObject
            }},
            {
                "arrayFilters" : [{"elemX.date":isTodayAdded[0].date}]
            }
        )
        return res.json({message:`Daily entery updated for ${verifyThing}`})
    }

    else
    {

        const today_date = new Date();

        const dailyEntryObject = {"date":today_date,"currPlanId":planId , "menu":updatedObject}

        const updateEntry = await DailyEntry.updateOne({"userId":userId } , {
            $push:{
                "attendance":dailyEntryObject
            }},
        )
        return res.json({message:`Daily entery updated for ${verifyThing}`})
    }
})

// export const deleteUser = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     // Confirm data
//     if (!id) {
//         return res.status(400).json({ message: 'User ID Required' })
//     }

//     // Does the user exist to delete?
//     const user = await User.findById(id).exec()

//     if (!user) {
//         return res.status(400).json({ message: 'User not found' })
//     }

//     const result = await user.deleteOne()

//     const reply = `Username ${result.email} with ID ${result._id} deleted`

//     res.json(reply)
// })