define(['lib/news_special/bootstrap', 'lib/news_special/share_tools/controller', 'createmap'], function (news, shareTools, createMap) {

    return {
        init: function (storyPageUrl) {

            shareTools.init('.main', {
                url:     storyPageUrl,
                header:  'Share this page',
                message: 'Custom message',
                hashtag: 'BBCNewsGraphics'
            });

            createMap.init();

        }
    };

});