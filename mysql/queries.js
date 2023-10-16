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
    return `SELECT user_id, chips, avatar FROM casino_users
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
  selectBJResults: () => {
    return `SELECT casino_blackjack_wins, casino_blackjack_loses, casino_blackjack_draws FROM casino_results
            WHERE username = ?`;
  },
};
