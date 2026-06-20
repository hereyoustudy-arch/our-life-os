// Достаёт userId из заголовка X-User-Id, который шлёт фронтенд после логина.
// Если заголовка нет — отвечает 401 и возвращает null (контроллер должен прервать обработку).
function getUserId(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    res.status(401).json({ success: false, error: 'X-User-Id header is required' });
    return null;
  }
  return userId;
}

module.exports = { getUserId };
