const Logout = async (req , res) => {
   try {
        const user = req.user;

        user.refreshToken = '';
        user.save({validateBeforeSave: false})

        return res.status(200)
        .clearCookie("RefreshToken")
        .json({
            message: "Logout Success"
        })

   } catch (error) {
    return res.status(500).json({
        error: "Internal server Error"
    })
   } 
}

export {Logout};