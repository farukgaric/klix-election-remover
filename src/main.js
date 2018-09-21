const KEYWORDS_URL = chrome.runtime.getURL('keywords.txt')
const CONTAINER = document.querySelector('.block-news') || document

const findKeywords = (post, lookupText, keywords) => {
    return keywords.some(keyword => {
        let regex = new RegExp(keyword, 'gi')
        return lookupText.match(regex)
    })
}

const removePosts = keywords => {
    let posts = [...document.querySelectorAll('.kolona')]
    keywords = keywords.split('\n')

    posts.forEach(post => {
        let found = findKeywords(post, post.querySelector('h1').textContent, keywords)
        if (found) {
            post.style.display = 'none'
        }
    })
}

const removeTags = keywords => {
    let tags = [...document.querySelectorAll('.tagovi a')]
    keywords = keywords.split('\n')

    tags.forEach(tag => {
        let found = findKeywords(tag, tag.textContent, keywords)
        if (found) {
            tag.style.display = 'none'
        }
    })
}

chrome.runtime.sendMessage({}, response => {
    fetch(KEYWORDS_URL)
        .then(blob => blob.text())
        .then(response => {

            // Initially remove all annoying posts
            removePosts(response)
            removeTags(response)

            // In case change in DOM happend perform remove action again
            let observer = new MutationObserver(mutations => {
                removePosts(response)
            })
            observer.observe(CONTAINER, { childList: true })

        })
        .catch(error => console.error(error)) 
})