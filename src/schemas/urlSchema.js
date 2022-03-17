import joi from "joi";

const urlSchema = joi.object({
    url: joi.string().pattern(new RegExp("^(http|https)://")).required(),
});

export default urlSchema;
