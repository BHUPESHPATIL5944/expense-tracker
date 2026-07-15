// insetead writing every route try and catch we have right the
// centalizer error handler
export const errorHandler=(err,req,res,next)=>{
    console.error(err.stack)

    const statusCode=err.statusCode || 500;
    const message=err.message || 'internal server error ';

    res.status(statusCode).json({
        success:false,
        message,
    });
};

export const asyncHandler=(fn)=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next))
    .catch(next);
};