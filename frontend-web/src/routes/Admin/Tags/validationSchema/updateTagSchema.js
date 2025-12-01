import * as Yup from 'yup';

export const updateTagSchema = Yup.object().shape({
    tagGroup: Yup.object(),
    name: Yup.string().required("Nama tag dibutuhkan"),
});