import {getWorkoutEntries, getWorkoutEntriesByExercise} from "./config/StatsFireDB.tsx";

async function run() {
    const userId = 'testUser';
    console.log(await getWorkoutEntries(userId));
    console.log(await getWorkoutEntriesByExercise(userId, 'Sentadilla'));
}
run().catch(console.error);