// A version of Promise.race() that ignores rejections.
export default function race(promises) {
    let alreadyResolved = false;
    let rejectedCount = 0;

    return new Promise((resolve, reject) => {
        promises.forEach(p => {
            p.then(handleFulfillment, handleRejection);
        });

        function handleFulfillment(result) {
            if (alreadyResolved) return;

            alreadyResolved = true;
            resolve(result);
        }

        function handleRejection(reason) {
            // noone knows what it's like... :-(
            if (++rejectedCount === promises.length) {
                reject(reason);
            }
        }
    });
}
