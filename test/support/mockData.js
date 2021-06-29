module.exports = function $mockData() {
  const users = [
    {
      id: 'ca718a21-a126-484f-bc50-145126a6f75b',
      email: 'user@user.com',
      password: '$2b$10$R3YT8/4SxWGfajHg6lSJ3eLw2ASxqeO8kOhtN2t3h2RzBUln3YjEa',
      fb_id: null,
      banned: false,
      first_name: 'user',
      last_name: 'user',
      profile_pic_url: null,
      signup_date: new Date('2021-06-13T21:29:29.330Z')
    },
    {
      id: 'f5c43d00-91d7-4ff8-9ecb-8087e67a5ffd',
      email: 'banned@banned.com',
      password: '$2b$10$e2NjtP9UJRYHj8wAxqYZae6Vkvlql1tCg5G4iupleOiiY7ybWu4L6',
      fb_id: null,
      banned: true,
      first_name: 'banned',
      last_name: 'banned',
      profile_pic_url: null,
      signup_date: new Date('2021-06-13T21:29:29.340Z')
    }
  ];

  const parsedUsers = [
    {
      id: 'ca718a21-a126-484f-bc50-145126a6f75b',
      email: 'user@user.com',
      banned: false,
      firstName: 'user',
      lastName: 'user',
      signupDate: '2021-06-13T21:29:29.330Z'
    },
    {
      id: 'f5c43d00-91d7-4ff8-9ecb-8087e67a5ffd',
      email: 'banned@banned.com',
      banned: true,
      firstName: 'banned',
      lastName: 'banned',
      signupDate: '2021-06-13T21:29:29.340Z'
    }
  ];

  return { users, parsedUsers };
};
