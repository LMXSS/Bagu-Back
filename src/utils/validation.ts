import * as dayjs from 'dayjs';

export const isMoreThen18 = (date: string) => {
    const hoje = dayjs();
    const dataNascimento = dayjs(date, 'YYYY-MM-DD');
    const idade = hoje.diff(dataNascimento, 'year');

    return idade >= 18;
}