const KEYWORDS_URL = chrome.runtime.getURL('keywords.txt')
const CONTAINER = document.querySelector('.block-news') || document

const findAnnoyingPosts = (post, keywords) => {
    let title = post.querySelector('h1').textContent
    return keywords.some(keyword => {
        let regex = new RegExp(keyword, 'gi')
        return title.match(regex)
    })
}

const removeAnnoyingPosts = keywords => {
    let posts = [...document.querySelectorAll('.kolona')]
    keywords = keywords.split('\n')

    posts.forEach(post => {
        let found = findAnnoyingPosts(post, keywords)
        if (found) {
            post.style.display = 'none'
        }
    })
}

chrome.runtime.sendMessage({}, response => {
    fetch(KEYWORDS_URL)
        .then(blob => blob.text())
        .then(response => {

            // Initially remove all annoying posts
            removeAnnoyingPosts(response)

            // In case change in DOM happend perform remove action again
            let observer = new MutationObserver(mutations => {
                removeAnnoyingPosts(response)
            })
            observer.observe(CONTAINER, { childList: true })

        })
        .catch(error => console.error(error)) 
})