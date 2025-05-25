function autoMod(value) {
    // List of filters with pattern-based wildcards and severity level
    const filters = [
        {
            name: "Discriminatory",
            severity: "High",
            words: ["*(🥷|🆖)*", "(?g)ga", "*n(?i|e)g(a|g|h)(?h|r|e|a)(?a)(?rs|s)*", "*f(?a)ag*", "*retard*",
            "coon(?s)", "*kike*", "yid(?s)", "*chink*", "ching(?s)", "*gook*", "*slopehead*", "jap(?s)",
            "*china(? )(wo)m(a|e)n*", "*coolie*", "*sambo*", "*tar(? )baby*", "*jemima(?s)*", "*mamm(?y|ies|s)*",
            "*pick(? )aninn(?y|ies|s)*", "*gay(? )lord(?s)*", "*dyke*", "*she(? )male*", "*trann(?y|ies|s)*",
            "*transvestite*", "*cripple*", "*white(? )power*", "n(? )word(?s)", "r(? )word(?s)", "cong(?s)",
            "*siss(?y|ies|s)*", "hard(?s)r", "*kanker(?s)*", "*lesbo(?s)*", "chong(?s)", "*cotton picker*"],
            message: "This word has been blocked",
            bypass: ""
        },
        {
            name: "Profanity",
            severity: "Low",
            words: ["*🖕*", "*middle(? )finger*", "*bi(?a)tch*", "*ar(?r)se(? )hole*", "*as(?s)(? )hole*", 
            "*basta(?r)(?d)*", "*b(o|u)l(?l)(? )lock*", "*stfu*", "*piss*", "*dumbas(?s)*", "*shit*",
            "*you(?r)(?e)(? )(?a)(? )birch*", "*bish*", "*f(?u)(c|k)*", "*f****", "*s****"],
            message: "This word has been blocked",
            bypass: ""
        },
        {
            name: "Profanity Abbreviations",
            severity: "Low",
            words: ["fml", "mf", "(?w)tf", "*my(? )(god|lord)*", "o(m|n)(?f)(g|l)", "ist(g|l)",
            "lm(?f)(a|b)o", "*🤬*", "*(⛱️|🏖️)*"],
            message: "This word has been blocked",
            bypass: ""
        }
    ];

    // Obfuscation mapping for each characters that allows matching variations of letters using Unicode, homoglyphs, or common substitutions
    const obfuscation_map = {
        a: "[aA4@ÁÀÂÄÃÅĀĂĄαΔΛД∆𝒶𝔞𝕒𝖆𝘢𝘼𝗮𝙖𝚊Ⓐⓐ🅐🄰𝐚𝖺ᵃₐ𝛂𝛼🇦]",
        b: "[bB8ß฿βБ𝒷𝔟𝕓𝖇𝘣𝘽𝗯𝙗𝚋Ⓑⓑ🅑🄱𝐛ᵇ𝛃𝛽🇧]",
        c: "[cC¢©çĆČĈĊςʗС𐐕𝒸𝔠𝕔𝖈𝘤𝘾𝗰𝙘𝚌Ⓒⓒ🅒🄲𝐜ᶜ𝛾🇨]",
        d: "[dDÐĎĐԀԁԃδȡ𝒹𝔡𝕕𝖉𝘥𝘿𝗱𝙙𝚍Ⓓⓓ🅓🄳𝐝ᵈ𝛅🇩]",
        e: "[eE3€éèêëēėęΞΣƐ𝑒𝔢𝕖𝖊𝘦𝙀𝗲𝙚𝚎Ⓔⓔ🅔🄴𝐞ᵉₑ🇪]",
        f: "[fFƒҒ₣𝒻𝔣𝕗𝖋𝘧𝙁𝗳𝙛𝚏Ⓕⓕ🅕🄵𝐟ᶠ🇫]",
        g: "[gG69ĝğġģɢǥ₲𝓰𝔤𝕘𝖌𝘨𝙂𝗴𝙜𝚐Ⓖⓖ🅖🄶𝐠ᵍ🇬]",
        h: "[hHĥħнннĦ#𝒽𝔥𝕙𝖍𝘩𝙃𝗵𝙝𝚑Ⓗⓗ🅗🄷𝐡ʰₕ🇭]",
        i: "[iI1!íìîïīįιІ¡|ǐ𝒾𝔦𝕚𝖎𝘪𝙄𝗶𝙞𝚒Ⓘⓘ🅘🄸𝐢ᶦᵢ🇮*]",
        j: "[jJĵʝјЈ¿𝒿𝔧𝕛𝖏𝘫𝙅𝗷𝙟𝚓Ⓙⓙ🅙🄹𝐣ʲ🇯]",
        k: "[kKĸκķĶⱩҠк𝓀𝔨𝕜𝖐𝘬𝙆𝗸𝙠𝚔Ⓚⓚ🅚🄺𝐤ᵏₖ🇰]",
        l: "[lL1|£łĿĹĻĽ⅃∣𝓁𝔩𝕝𝖑𝘭𝙇𝗹𝙡𝚕Ⓛⓛ🅛🄻𝐥ˡₗ🇱]",
        m: "[mM₥µмṃṁмм𝓂𝔪𝕞𝖒𝘮𝙈𝗺𝙢𝚖Ⓜⓜ🅜🄼𝐦ᵐₘ🇲]",
        n: "[nNñńņňŉηпПИИ∏𝓃𝔫𝕟𝖓𝘯𝙉𝗻𝙣𝚗Ⓝⓝ🅝🄽𝐧ⁿₙ🇳]",
        o: "[oO0°øõöôóòœōΘФ¤◎𝓸𝔬𝕠𝖔𝘰𝙊𝗼𝙤𝚘Ⓞⓞ🅞🄾𝐨ᵒₒ🇴]",
        p: "[pPþρрҏ₱¶℗℘𝓅𝔭𝕡𝖕𝘱𝙋𝗽𝙥𝚙Ⓟⓟ🅟🄿𝐩ᵖₚ🇵]",
        q: "[qQ9ǫզԛɋʠ𝓆𝔮𝕢𝖖𝘲𝙌𝗾𝙦𝚚Ⓠⓠ🅠🅀𝐪🇶]",
        r: "[rR®řŗгѓґяЯ𝓇𝔯𝕣𝖗𝘳𝙍𝗿𝙧𝚛Ⓡⓡ🅡🅁𝐫ʳ🇷]",
        s: "[sS5$§šśșșѕꜱʂ𝓈𝔰𝕤𝖘𝘴𝙎𝘀𝚠Ⓢⓢ🅢🅂𝐬ˢₛ🇸]",
        t: "[tT7+†ţŧтт𝓉𝔱𝕥𝖙𝘵𝙏𝗲𝙩𝚝Ⓣⓣ🅣🅃𝐭ᵗₜ🇹]",
        u: "[uU(_)|üûùúūųµџцџʉ𝓊𝔲𝕦𝖚𝘶𝙐𝗲𝙪𝚞Ⓤⓤ🅤🅄𝐮ᵘᵤ🇺]",
        v: "[vV√ʌνvⱱѵ𝓋𝔳𝕧𝖛𝘷𝙑𝗲𝙫𝚟Ⓥⓥ🅥🅅𝐯ᵛ🇻]",
        w: "[wWωŵшщѡẁẃẅ𝓌𝔴𝕨𝖜𝘸𝙒𝗲𝙬𝚠Ⓦⓦ🅦🅆𝐰ʷ🇼]",
        x: "[xX×χхж𝓍𝔵𝕩𝖝𝘹𝙓𝗲𝙭𝚡Ⓧⓧ🅧🅇𝐱ˣₓ🇽]",
        y: "[yY¥ýÿŷуҮҰүγ𝓎𝔶𝕪𝖞𝘺𝙔𝗲𝙮𝚢Ⓨⓨ🅨🅈𝐲ʸ🇾☯]",
        z: "[zZ2žźżʐʑƶℤ𝓏𝔷𝕫𝖟𝘻𝙕𝗲𝙯𝚣Ⓩⓩ🅩🅉𝐳ᶻ🇿]",
    };

    // Characters here are removed when checking filters to prevent escaping filters
    const separators = [
        " ", "-", ".", "_", "*", "^", "~", "`", "=", "+", ",", "|", "/", "\\", "'", "\"", ":", ";", 
        "(", ")", "[", "]", "{", "}", "<", ">", "@", "#", "!", "$", "%", "?", "\n", "\r",
        "\u200b", "\u200c", "\u200d", "\u2060"
    ];

    // Escape regex-special characters in literal text
    function escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Build a full regex pattern from a potentially wildcarded and obfuscated keyword
    function buildWordRegex(word) {
        const prefixWildcard = word.startsWith("*");
        const suffixWildcard = word.endsWith("*");
        const baseWord = word.replace(/^\*|\*$/g, "").toLowerCase();

        let pattern = "";
        let i = 0;

        while (i < baseWord.length) {
            const ch = baseWord[i];

            // Handle optional single char or optional group
            if (ch === '(' && baseWord[i + 1] === '?') {
                i += 2; // skip "(?"
                let group = "";
                let depth = 1;
                while (i < baseWord.length && depth > 0) {
                    const c = baseWord[i];
                    if (c === '(') depth++;
                    if (c === ')') depth--;
                    if (depth > 0) group += c;
                    i++;
                }

                if (group.includes('|')) {
                    // Optional group (a|b|c)
                    const options = group.split('|').map(opt => {
                        return opt
                            .split('')
                            .map(c => obfuscation_map[c] || escapeRegex(c))
                            .join(`[${escapeRegex(separators.join(""))}]*`);
                    });
                    pattern += `(?:${options.join('|')})?`;
                } else {
                    // Optional single character (?x)
                    const charPattern = obfuscation_map[group] || escapeRegex(group);
                    pattern += `(?:${charPattern}[${escapeRegex(separators.join(""))}]*)?`;
                }
            }

            // Handle required group (a|b)
            else if (ch === '(') {
                let group = "";
                let depth = 1;
                i++; // skip '('
                while (i < baseWord.length && depth > 0) {
                    const c = baseWord[i];
                    if (c === '(') depth++;
                    if (c === ')') depth--;
                    if (depth > 0) group += c;
                    i++;
                }

                const options = group.split('|').map(opt => {
                    return opt
                        .split('')
                        .map(c => obfuscation_map[c] || escapeRegex(c))
                        .join(`[${escapeRegex(separators.join(""))}]*`);
                });

                // Add separators *before* and *after* the group as well:
                pattern += `[${escapeRegex(separators.join(""))}]*` + `(?:${options.join('|')})` + `[${escapeRegex(separators.join(""))}]*`;
            }

            // Regular character
            else {
                const charPattern = obfuscation_map[ch] || escapeRegex(ch);
                pattern += charPattern;
                if (i < baseWord.length - 1) {
                    pattern += `[${escapeRegex(separators.join(""))}]*`;
                }
                i++;
            }
        }

        // Apply wildcard matching
        if (prefixWildcard && suffixWildcard) {
            pattern = `(?<!\\S)\\S*${pattern}\\S*(?!\\S)`;
        } else if (prefixWildcard) {
            pattern = `(?<!\\S)\\S*${pattern}(?!\\S)`;
        } else if (suffixWildcard) {
            // Here is the important change:
            const sepClass = `[${escapeRegex(separators.join(''))}]*`;
            pattern = `(?<!\\S)${sepClass}${pattern}${sepClass}(?!\\S)`;
        } else {
            // Also here:
            const sepClass = `[${escapeRegex(separators.join(''))}]*`;
            pattern = `(?<!\\S)${sepClass}${pattern}${sepClass}(?!\\S)`;
        }

        return new RegExp(pattern, "i");
    }

    function highlight(text, regex) {
        const sepPattern = separators.map(s => `\\${s}`).join('');
        const sepRegex = new RegExp(`^[${sepPattern}]+|[${sepPattern}]+$`, 'g');

        return text.replace(regex, match => {
            const parts = [];
            let remaining = match;
            let leading = '', trailing = '';

            const leadingMatch = remaining.match(new RegExp(`^[${sepPattern}]+`));
            if (leadingMatch) {
                leading = leadingMatch[0];
                remaining = remaining.slice(leading.length);
            }

            const trailingMatch = remaining.match(new RegExp(`[${sepPattern}]+$`));
            if (trailingMatch) {
                trailing = trailingMatch[0];
                remaining = remaining.slice(0, -trailing.length);
            }

            return `${leading}<mark>${remaining}</mark>${trailing}`;
        });
    }

    // DOM references (some are not yet active)
    const username = "Username";
    const handle = "@username";
    const checkExtras = true; // Set to false to ignore username/handle in checks

    const val = value;
    const extraText = checkExtras ? `${username} ${handle}` : "";

    let highlightText = val;
    let highlightUsername = username;
    let highlightHandle = handle;
    let blocked = false;
    let reason = null;
    let source = "";
    let matchedWord = "";

    const matches = [];

    // First, check profile data (username and handle)
    for (const filter of filters) {
        for (const word of filter.words) {
            const regex = buildWordRegex(word);

            if (checkExtras && regex.test(username)) {
                blocked = filter.bypass !== "AvatarKage";
                reason = filter;
                matchedWord = word;
                source = "Username";
                highlightUsername = highlight(username, regex);
                break;
            }

            if (checkExtras && regex.test(handle)) {
                blocked = filter.bypass !== "AvatarKage";
                reason = filter;
                matchedWord = word;
                source = "Handle";
                highlightHandle = highlight(handle, regex);
                break;
            }
        }
        if (blocked) break;
    }

    // If username/handle clean, scan the input field for ALL matches
    if (!blocked) {
        for (const filter of filters) {
            for (const word of filter.words) {
                const regex = buildWordRegex(word);
                if (regex.test(val)) {
                    matches.push({ regex, word, filter });
                }
            }
        }

        if (matches.length > 0) {
            blocked = matches[0].filter.bypass !== "AvatarKage";
            reason = matches[0].filter;
            matchedWord = matches[0].word;
            source = "Message";

            // Highlight ONLY the first matched word in the input
            const { regex } = matches[0];
            highlightText = highlight(highlightText, regex);

            // Highlight ALL matched words in the input
            //for (const { regex } of matches) {
            //    highlightText = highlight(highlightText, regex);
            //}
        }
    }

    if (blocked) {
        let flaggedText;

        if (source === "Username") {
            const regex = buildWordRegex(matchedWord);
            flaggedText = highlightUsername.replace(regex, match => `<mark>${match}</mark>`);
        } else if (source === "Handle") {
            const regex = buildWordRegex(matchedWord);
            flaggedText = highlightHandle.replace(regex, match => `<mark>${match}</mark>`);
        } else {
            flaggedText = highlightText.replace(/\n/g, '<br>');
        }

        return {
            data: [
                {
                    text: highlightText.replace(/\n/g, '<br>'),
                    word: matchedWord,
                    filter: JSON.stringify(
                    Object.fromEntries(Object.entries(reason).filter(([key]) => key !== "words"))),
                    source: source
                }
            ]
        };

    } else {
        return null;
    }
}

// Export for CommonJS
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = autoMod;
}

// Export for ES Modules
if (typeof exports === 'undefined' || typeof exports !== 'object') {
    if (typeof globalThis !== 'undefined') {
        globalThis.autoMod = autoMod;
    } else if (typeof window !== 'undefined') {
        window.autoMod = autoMod;
    } else if (typeof self !== 'undefined') {
        self.autoMod = autoMod;
    }
}