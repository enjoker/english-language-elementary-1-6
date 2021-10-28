const baseURL = 'https://api.test.schoolcare.app/';

export const getSubGrade = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-grade';
};

export const getLevelAndExam = () => {
  return baseURL + 'exam-no-auth/find-by-amount-and-level';
};
export const getSubAndTimeGrade1 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/1';
};
export const getSubAndTimeGrade2 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/35';
};
export const getSubAndTimeGrade3 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/36';
};
export const getSubAndTimeGrade4 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/37';
};
export const getSubAndTimeGrade5 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/38';
};
export const getSubAndTimeGrade6 = () => {
  return baseURL + 'sub-of-grade-no-auth/find-by-cgd-id/39';
};


export const sendReport = () => {
  return baseURL + 'report-no-auth/create';
}