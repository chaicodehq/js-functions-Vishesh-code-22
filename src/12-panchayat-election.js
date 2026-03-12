/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
    // Your code here
    const votesInternal = [];
    const registeredVoters = [];

    function registerVoter(voter) {
        if (
            !voter ||
            !voter.hasOwnProperty("id") ||
            registeredVoters.some((regVoter) => regVoter.id === voter.id) ||
            voter.age < 18
        ) {
            return false;
        } else {
            registeredVoters.push(voter);
            return true;
        }
    }

    function castVote(voterId, candidateId, onSuccess, onError) {
        if (
            !registeredVoters.some((voter) => voter.id === voterId) ||
            !candidates.some((candidate) => candidate.id === candidateId) ||
            votesInternal.some((vote) => vote.voterId === voterId)
        ) {
            return onError("Already done");
        } else {
            votesInternal.push({ voterId, candidateId });
            return onSuccess({ voterId, candidateId });
        }
    }

    function getResults(sortFn) {
        // we need to get vote count for each candidate
        // candidates = array of {id, name, party}
        // votes = array of {voterId, candidateId}
        const result = candidates.map((candidate) => {
            const votes = votesInternal.filter(
                (vote) => vote.candidateId === candidate.id,
            ).length;
            return {
                ...candidate,
                votes,
            };
        });
        if (sortFn) {
            return result.sort(sortFn);
        } else {
            return result.sort((a, b) => b.votes - a.votes);
        }
    }

    function getWinner() {
        if (votesInternal.length === 0) {
            return null;
        }
        return getResults()[0];
        //
    }

    return {
        registerVoter,
        castVote,
        getResults,
        getWinner,
    };
}

export function createVoteValidator(rules) {
    // Your code here
    return function (voter) {
        // voter = {id, name, age}
        if (!rules.requiredFields.every((rule) => voter.hasOwnProperty(rule))) {
            return {
                valid: false,
                reason: "Properties missing",
            };
        } else if (voter.age < rules.minAge) {
            return {
                valid: false,
                reason: "Underage",
            };
        } else {
            return {
                valid: true,
                reason: "All good",
            };
        }
    };
}

export function countVotesInRegions(regionTree) {
    // Your code here
    // just to understand
    // const tree = {
    //     name,
    //     votes,
    //     sub: [
    //         {
    //             name,
    //             votes,
    //             sub: [
    //                 {
    //                     name,
    //                     votes,
    //                     sub: [],
    //                 },
    //                 { name, votes, sub: [] },
    //             ],
    //         },
    //         { name, votes, sub: [] },
    //         { name, votes, sub: [] },
    //     ],
    // };

    if (!regionTree) {
        return 0;
    }

    if (regionTree.subRegions.length === 0) {
        return regionTree.votes;
    }

    return regionTree.subRegions.reduce(
        (sum, curr) => sum + countVotesInRegions(curr),
        regionTree.votes,
    );
}

export function tallyPure(currentTally, candidateId) {
    // Your code here
    const newTally = { ...currentTally };
    newTally[candidateId] = (newTally[candidateId] || 0) + 1;
    return newTally;
}
