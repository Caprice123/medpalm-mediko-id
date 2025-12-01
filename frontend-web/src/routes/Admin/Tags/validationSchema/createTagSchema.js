import * as Yup from 'yup';

export const createTagSchema = Yup.object().shape({
    tagGroup: Yup.object(),
    name: Yup.string().required("Nama tag dibutuhkan"),
});