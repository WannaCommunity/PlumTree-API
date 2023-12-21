module.exports = {
  generateResetLink: (username, resetToken) => {
    return `https://${process.env.DOMAIN}/reset-password?u=${username}&t=${resetToken}`
  },
  generateToken: () => {
    let token = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 32; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return token
  }
}
