const baseURL = 'https://api.test.schoolcare.app/';

export const getSubGrade = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-grade';
};

export const getLevelAndExam = () => {
  return baseURL + 'exam-no-auth/find-by-amount-and-level';
};


export const sendReport = () => {
  return baseURL + 'report-no-auth/create';
}