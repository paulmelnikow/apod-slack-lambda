'use strict'

const makeApodUri = dateString => {
  // 2016-05-11 -> http://apod.nasa.gov/apod/ap160511.html
  const cleanedDate = dateString.slice(2).replace(/-/g, '')

  return `http://apod.nasa.gov/apod/ap${cleanedDate}.html`
}

const processVideoUri = videoUri =>
  // https://www.youtube.com/embed/8J4LoX3eOWc?rel=0 ->
  // https://www.youtube.com/watch?v=8J4LoX3eOWc
  videoUri
    .replace(
      'https://www.youtube.com/embed/',
      'https://www.youtube.com/watch?v='
    )
    .replace('?rel=0', '')

const modernize = text => text.replace(/ {2}/g, ' ').replace(/--/g, '\u2013')

const formatSlackMessage = apodData => {
  const title = `_Today's Astronomy Picture of the Day_\n*${apodData.title}*`

  let details = [
    modernize(apodData.explanation),
    '',
    `Read more: ${makeApodUri(apodData.date)}`,
  ]
  if (apodData.copyright) {
    details = details.concat(['', `Copyright: ${apodData.copyright}`])
  }
  details = details.join('\n')

  const attachments = [{ text: details }]

  let mainText
  if (apodData.media_type === 'image') {
    attachments.push({
      image_url: apodData.hdurl || apodData.url,
    })
    mainText = title
  } else if (apodData.media_type === 'video') {
    mainText = `${title}\n<${processVideoUri(apodData.url)}>`
  }

  return {
    username: 'apod',
    icon_emoji: ':milky_way:',
    text: mainText,
    attachments,
  }
}

module.exports = formatSlackMessage
