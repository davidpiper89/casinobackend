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
  selectUserIDChipsAvatar: () => {
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
  selectAvatars: () => {
    return `SELECT avatar_id FROM casino_user_collection WHERE username = ?`;
  },
  selectUserCount: () => {
    return `SELECT count(*) AS count, user_id FROM casino_logins WHERE token= ? ;`;
  },
  setAvatar: () => {
    return `UPDATE casino_users SET avatar = ? WHERE username = ?`;
  },
  selectUserCountFromUsername: () => {
    return `SELECT COUNT(*) as count FROM casino_users WHERE username = ?`;
  },
  selectUserCountFromEmail: () => {
    return `SELECT COUNT(*) as count FROM casino_users WHERE email = ?`;
  },
  setUserAvatarCollection: () => {
    return `INSERT IGNORE INTO casino_user_collection (user_id, username, avatar_id) VALUES (?, ?, ?)`;
  },
  setCasinoResults: (resultType) => {
    return `INSERT INTO casino_results (username, user_id, casino_blackjack_${resultType}s)
      VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE casino_blackjack_${resultType}s = casino_blackjack_${resultType}s + 1 `;
  },
  selectUserId: () => {
    return `SELECT user_id FROM casino_logins WHERE token = ? `;
  },
  selectPassword: () => {
    return `SELECT password from casino_users WHERE user_id = ?`;
  },
  updatePassword: () => {
    return `UPDATE casino_users SET password = ? WHERE user_id = ?`;
  },
  selectOldUsername: () => {
    return `SELECT username as oldUsername FROM casino_users WHERE user_id = ?`;
  },
  selectUsername: () => {
    return `SELECT username FROM casino_users WHERE username = ? AND user_id != ?`;
  },
  updateUsernameResultsTable: () => {
    return `UPDATE casino_results SET username = ? WHERE username = ?`;
  },
  updateUsernameUsersTable: () => {
    return `UPDATE casino_users SET username = ? WHERE user_id = ?`;
  },
  updateUsernameCollectionTable: () => {
    return `UPDATE casino_user_collection SET username = ? WHERE user_id = ?`;
  },
};
