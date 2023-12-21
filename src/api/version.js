exports.handler = async () => {
  const version = process.env.VERSION
  const color = process.env.STACK

  return {
    statusCode: 200,
    isBase64Encoded: false,
    body: JSON.stringify({
      version,
      color
    })
  }
}
