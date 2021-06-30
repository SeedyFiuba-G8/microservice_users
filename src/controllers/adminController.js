module.exports = function $adminController(adminService, expressify) {
  return expressify({
    login,
    register
  });

  async function login(req, res) {
    const credentials = req.body;
    const id = await adminService.login(credentials);

    return res.status(200).json({ id });
  }

  async function register(req, res) {
    const adminData = req.body;
    await adminService.register(adminData);

    return res.status(201).send();
  }
};
