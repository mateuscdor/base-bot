const onlyNumbers = new RegExp("^[0-9]+$");
const onlyLetters = new RegExp("^[a-zA-Z\u00C0-\u00FF]+$");

const hasNumber = new RegExp(/\d/g);
const hasLetterUpperCase = new RegExp(/[A-Z]/);
const hasLetterLowerCase = new RegExp(/[a-z]/);
const hasLetter = new RegExp(/[a-zA-Z\u00C0-\u00FF]+/i);
const isEmail = new RegExp(/(.*?)\w{2}@(.*?)\w{2}[.]\w{2}/);
const hasCharSpecials = new RegExp(
  /[!@#$%^&*()\-,.?"~`'¨:;_{}|<>/|\\°£¢¬¹²³]/g
);

const hasCharSpecialsEmail = new RegExp(
  /[!#$%^&*(),?"~`'¨:;{}|<>/|\\°£¢¬¹²³]/g
);

module.exports = {
  isEmail,
  onlyNumbers,
  onlyLetters,
  hasCharSpecialsEmail,
  hasNumber,
  hasCharSpecials,
  hasLetter,
  hasLetterLowerCase,
  hasLetterUpperCase,
};
