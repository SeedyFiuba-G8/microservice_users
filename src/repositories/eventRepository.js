module.exports = function $eventRepository(errors, knex) {
  return {
    count
  };

  function count(event, initialDate, finalDate) {
    return knex('events')
      .count('event')
      .where('event', event)
      .whereBetween('date', [initialDate, finalDate])
      .then((result) => Number(result[0].count));
  }
};
