module.exports = function $eventRepository(knex) {
  return {
    count,
    log
  };

  function count(event, initialDate, finalDate) {
    return knex('events')
      .count('event')
      .where('event', event)
      .whereBetween('date', [initialDate, finalDate])
      .then((result) => Number(result[0].count));
  }

  async function log(event) {
    const date = new Date();
    await knex('events').insert({
      event,
      date
    });
  }
};
