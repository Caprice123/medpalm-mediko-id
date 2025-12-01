import * as Yup from 'yup';

export const createTagGroupSchema = Yup.object().shape({
    name: Yup.string().required("Nama tag group dibutuhkan"),
    tagName: Yup.string().required("Nama tag dibutuhkan"),
});