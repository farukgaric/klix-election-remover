const KEYWORDS_URL = chrome.runtime.getURL('keywords.txt')
const CONTAINER = document.querySelector('.block-news') || document

const MAIN_POSTS = document.querySelectorAll('.kolona')
const TAGS = document.querySelectorAll('.tagovi a')
const SIDEBAR_POSTS = document.querySelectorAll('.articleList a')
const FEATURED_POSTS = document.querySelectorAll('.izdvojeneList .col-md-12')

const findKeywords = (post, keywords, lookupText) => {
    return keywords.some(keyword => {
        let regex = new RegExp(keyword, 'gi')
        return lookupText.match(regex)
    })
}

const performRemoveAction = (elements, keywords, node) => {
    elements.forEach(element => {
        let found = findKeywords(element, keywords, node ? element.querySelector(node).textContent : element.textContent)
        if (found) {
            element.style.display = 'none'
        }
    })
}

chrome.runtime.sendMessage({}, response => {
    fetch(KEYWORDS_URL)
        .then(blob => blob.text())
        .then(response => {

            let keywords = response.split('\n')

            performRemoveAction(MAIN_POSTS, keywords, 'h1')
            performRemoveAction(TAGS, keywords)
            performRemoveAction(SIDEBAR_POSTS, keywords, '.title')
            performRemoveAction(FEATURED_POSTS, keywords, '.naslov')

            // In case change in DOM happend, perform remove action again
            let observer = new MutationObserver(mutations => {
                let latestMainPosts = document.querySelectorAll('.kolona')
                performRemoveAction(latestMainPosts, keywords, 'h1')
            })
            observer.observe(CONTAINER, { childList: true })

        })
        .catch(error => console.error(error)) 
})