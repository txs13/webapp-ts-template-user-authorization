// this file contains copies from front end input regexes.
// at this phase I have decided not to organize anything like sharing
// types / interfaces between front end and back end and just copied them to this file

// IF SOMETHING IS NOT WORKING WITH API CALL PLEASE CHECK THIS FIRST

export const nameRegex = /^[A-Za-z'"][A-Za-z0-9 _'"-]*[A-Za-z0-9'".]$/;

export const longTextRegex =
  /^[A-Za-z][A-Za-z0-9 _,.!?()'"/-]*[A-Za-z0-9.!)'"]$/;

export const addressTextRegex =
  /^[A-Za-z][A-Za-z0-9 _,.()'"/-]*[A-Za-z0-9.)'"]$/;

export const phoneNumberTextRegex = /^[+0-9][0-9 p.;-]*[0-9]$/;