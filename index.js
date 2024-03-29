const titleInput = document.getElementById('title-tag-input')
const descInput = document.getElementById('desc-input')

const fontURLRoboto = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
const fontURLRobotoBold = 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2'
const fontFaceRoboto = new FontFace('Roboto', `url(${fontURLRoboto})`)
const fontFaceRobotoBold = new FontFace('Roboto-bold', `url(${fontURLRobotoBold})`, {
    style: 'normal',
    weight: 500,
})

const serpData = {
    title: '',
    titleWidth: 0,
    desc: '',
}

;(async function loadFonts() {
    await fontFaceRoboto.load()
    document.fonts.add(fontFaceRoboto)
})()


const pubsub = (() => {
    const events = {};

    let subscribersId = -1;

    function publish(event, data) {
        if (!events[event]) {
            return false;
        }

        const subscribers = events[event];
        subscribers.forEach((subscriber) => {
            subscriber.callback(event, data);
        });
        return true;
    }

    function subscribe(event, callback) {
        if (!events[event]) {
            events[event] = [];
        }

        subscribersId += 1;
        const token = subscribersId.toString();
        events[event].push({
            token,
            callback,
        });
        return token;
    }

    function unsubscribe(token) {
        const found = Object.keys(events).some((event) => events[event].some((subscriber, index) => {
            const areEqual = subscriber.token === token.toString();
            if (areEqual) {
                events[event].splice(index, 1);
            }
            return areEqual;
        }));

        return found ? token : null;
    }

    return {
        publish,
        subscribe,
        unsubscribe,
    };
})();

/* ************************************** load fonts ************************************** */
// fontFaceRoboto.load().then((font) =>{
//     document.fonts.add(font)
// })
// fontFaceRobotoBold.load().then((font) =>{
//     document.fonts.add(font)
// })

/* ************************************** callbacks ************************************** */
function measureTitleWidth(_event, data) {
    const canvas = document.getElementById('title-canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = '24px'
    const text = serpData.title
    const textMetrics = ctx.measureText(text)
    serpData.titleWidth = textMetrics.width
    console.log(serpData.titleWidth)
}

function displayTitle(_event, data) {
    const titleEl = document.getElementById('title-display')
    titleEl.innerText = serpData.title
}

function displayDesc(_event, data) {
    const descEl = document.getElementById('desc-display')
    descEl.innerText = serpData.desc
}

function displayTitleLength(_event, data) {
    const titleLengthEl = document.getElementById('title-length-display')
    titleLengthEl.innerText = `The length of title: ${Math.ceil(serpData.title.length)}`
}

/* ************************************** subscribers ************************************** */

function titleUpdateEvent(e) {
    serpData.title = e.target.value
    pubsub.publish('updateTitle', { serpData })
}

function descUpdateEvent(e) {
    serpData.desc = e.target.value
    pubsub.publish('updateDesc', { serpData })
}

pubsub.subscribe('updateTitle', displayTitle)
pubsub.subscribe('updateTitle', displayTitleLength)
pubsub.subscribe('updateTitle', measureTitleWidth)
pubsub.subscribe('updateDesc', displayDesc)

/* ************************************** event listeners ************************************** */
titleInput.addEventListener('input', titleUpdateEvent)
descInput.addEventListener('input', descUpdateEvent)
