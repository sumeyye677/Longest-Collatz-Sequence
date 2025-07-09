const memoCache = new Map();
function getCollatzLength(n) {
    if (memoCache.has(n)) {
        return memoCache.get(n);
    }
    
    const original = n;
    let length = 0;
    
    while (n !== 1 && !memoCache.has(n)) {
        if (n % 2 === 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        length++;
    }
    
    
    const totalLength = length + (n === 1 ? 1 : memoCache.get(n));
    memoCache.set(original, totalLength);
    
    return totalLength;
}


function findLongestCollatz() {
    const limit = parseInt(document.getElementById('limit').value);
    
    
    if (!limit || limit < 1 || limit > 1000000) {
        alert('Lütfen 1 ile 1000000 arasında bir sayı girin!');
        return;
    }

  
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    
    memoCache.clear();
    memoCache.set(1, 1);

    
    let current = 1;
    let longestLength = 0;
    let longestNumber = 0;
    let allResults = [];
    
    function processChunk() {
        const chunkSize = Math.min(10000, limit - current + 1);
        const endIndex = current + chunkSize - 1;
        
        for (let i = current; i <= endIndex && i <= limit; i++) {
            const length = getCollatzLength(i);
            
            allResults.push({
                number: i,
                length: length
            });

            if (length > longestLength) {
                longestLength = length;
                longestNumber = i;
            }
        }
        
        current = endIndex + 1;
        
       
        const progress = Math.round((current / limit) * 100);
        document.getElementById('loading').innerHTML = `🔄 Hesaplama yapılıyor... ${progress}%`;
        
        if (current <= limit) {
            setTimeout(processChunk, 10); 
        } else {
            
            const longestSequence = calculateFullSequence(longestNumber);
            allResults.sort((a, b) => b.length - a.length);
            displayResults(longestNumber, longestLength, longestSequence, allResults.slice(0, 10), limit);
            document.getElementById('loading').style.display = 'none';
        }
    }
    
    processChunk();
}




function calculateFullSequence(n) {
    const sequence = [];
    let current = n;
    
    while (current !== 1) {
        sequence.push(current);
        if (current % 2 === 0) {
            current = current / 2;
        } else {
            current = 3 * current + 1;
        }
    }
    sequence.push(1);
    
    return sequence;
}



function displayResults(longestNumber, longestLength, longestSequence, top10, totalCalculated) {
    
    document.getElementById('longestNumber').textContent = longestNumber;
    document.getElementById('longestLength').textContent = longestLength;
    document.getElementById('totalCalculated').textContent = totalCalculated;

    
    const sequenceText = longestSequence.slice(0, 50).join(' → ') + 
                        (longestSequence.length > 50 ? ' → ... → 1' : '');
    document.getElementById('longestSequence').textContent = sequenceText;

 
    let top10Text = '';
    top10.forEach((result, index) => {
        top10Text += `${index + 1}. Sayı: ${result.number}, Uzunluk: ${result.length}\n`;
    });
    document.getElementById('top10').textContent = top10Text;

   
    document.getElementById('results').style.display = 'block';
}



document.addEventListener('DOMContentLoaded', function() {


    
    document.getElementById('limit').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            findLongestCollatz();
        }
    });
});



if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCollatzLength,
        calculateFullSequence,
        findLongestCollatz,
        displayResults
    };
}