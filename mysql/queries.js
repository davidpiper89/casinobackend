module.exports = {
  insertUser: () => {
    return `INSERT IGNORE casino_users
                (username, password, email, chips)
                VALUES
                (?, ?, ?, ?)`;
  },
  insertGoogleUser: () => {
    return `INSERT IGNORE casino_users
    (username, email)
    VALUES
    (?, ?)`;
  },
  selectUserID: () => {
    return `SELECT user_id, chips FROM casino_users
                 WHERE username = ? 
                 AND password = ?;`;
  },
  insertUserToLogin: () => {
    return `INSERT INTO casino_logins
                (user_id, token)
                VALUES
                (?, ?);`;
  },
  selectGoogleUserID: () => {
    return `SELECT user_id FROM casino_users
                 WHERE email = ?`;
  },
  updateChipsByUser: () => {
    return `UPDATE casino_users SET chips = ? WHERE username = ?`;
  },
};
