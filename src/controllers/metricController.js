module.exports = function $metricController(expressify, metricService) {
  return expressify({
    getBasic,
    getEvents
  });

  async function getBasic(req, res) {
    const metrics = await metricService.getBasic();

    return res.status(200).json(metrics);
  }

  async function getEvents(req, res) {
    const { initialDate, finalDate } = req.query;
    const metrics = await metricService.getEventsBetween(
      initialDate,
      finalDate
    );

    return res.status(200).json(metrics);
  }
};
