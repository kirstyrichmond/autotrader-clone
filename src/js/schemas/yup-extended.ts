import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";
import { FormikErrors, FormikProps, FormikTouched, FormikValues } from "formik";

yup.addMethod<yup.StringSchema>(yup.string, "emptyAsUndefined", function () {
    return this.transform((value) => (value ? value : undefined));
});

yup.addMethod<yup.NumberSchema>(yup.number, "emptyAsUndefined", function () {
    return this.transform((value, originalValue) =>
        String(originalValue)?.trim() ? value : undefined
    );
});

export type FormikSchema =
    FormikProps<FormikValues | FormikErrors<{ [g: string]: string | AnyObject }>
        | FormikTouched<{ [g: string]: boolean | AnyObject }>> | AnyObject;

declare module "yup" {
    interface StringSchema<TType extends Maybe<string> = string | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType> extends yup.BaseSchema<TType, TContext, TOut> {
        emptyAsUndefined(): StringSchema<TType, TContext>;
    }

    interface NumberSchema<TType extends Maybe<number> = number | undefined,
        TContext extends AnyObject = AnyObject,
        TOut extends TType = TType> extends yup.BaseSchema<TType, TContext, TOut> {
        emptyAsUndefined(): NumberSchema<TType, TContext>;
    }
}

export default yup;