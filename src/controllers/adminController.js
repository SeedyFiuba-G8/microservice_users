module.exports = function $adminController(adminService, expressify) {
  return expressify({
    getAll,
    login,
    register
  });

  async function getAll(req, res) {
    const admins = await adminService.getAll();

    return res.status(200).json({ admins });
  }

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
