// import {
//     Card,
//     CardContent,
// } from "@/components/ui/card";
// import { Trash2, Edit2 } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { WorkoutDetailProps } from '../pages/workout-edit-page'

// export function ExercisesDetails({ workout, openEditModal, newExercise, setNewExercise, removeExercise, addExercise }: WorkoutDetailProps) {
//     return (
//         <div className="mb-6">
//             <h2 className="text-xl font-bold mb-4">Exercises</h2>
//             <Card>
//                 <CardContent className="p-4">
//                     <div className="space-y-4">
//                         {workout.exercises.map((exercise) => (
//                             <div key={exercise.id} className="flex items-center gap-4 p-4 border rounded">
//                                 <div className="flex-1">
//                                     <h3 className="font-bold">{exercise.name}</h3>
//                                     <p className="text-sm text-gray-600">
//                                         {exercise.sets} sets × {exercise.reps || exercise.duration}
//                                         {exercise.weight && ` @ ${exercise.weight}`}
//                                     </p>
//                                 </div>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => openEditModal(exercise)}
//                                     className="mr-2"
//                                 >
//                                     <Edit2 size={16} />
//                                 </Button>
//                                 <Button
//                                     variant="destructive"
//                                     size="sm"
//                                     onClick={() => removeExercise(exercise.id)}
//                                 >
//                                     <Trash2 size={16} />
//                                 </Button>
//                             </div>
//                         ))}

//                         <div className="border-t pt-4">
//                             <h3 className="font-bold mb-2">Add New Exercise</h3>
//                             <div className="space-y-2">
//                                 <input
//                                     type="text"
//                                     placeholder="Exercise Name"
//                                     className="w-full p-2 border rounded"
//                                     value={newExercise.name}
//                                     onChange={(e) => setNewExercise({
//                                         ...newExercise,
//                                         name: e.target.value
//                                     })}
//                                 />
//                                 <div className="flex gap-2">
//                                     <input
//                                         type="number"
//                                         placeholder="Sets"
//                                         className="w-1/4 p-2 border rounded"
//                                         value={newExercise.sets}
//                                         onChange={(e) => setNewExercise({
//                                             ...newExercise,
//                                             sets: e.target.value
//                                         })}
//                                     />
//                                     <input
//                                         type="text"
//                                         placeholder="Reps/Duration"
//                                         className="w-1/4 p-2 border rounded"
//                                         value={newExercise.reps}
//                                         onChange={(e) => setNewExercise({
//                                             ...newExercise,
//                                             reps: e.target.value
//                                         })}
//                                     />
//                                     <input
//                                         type="text"
//                                         placeholder="Weight (optional)"
//                                         className="w-1/4 p-2 border rounded"
//                                         value={newExercise.weight}
//                                         onChange={(e) => setNewExercise({
//                                             ...newExercise,
//                                             weight: e.target.value
//                                         })}
//                                     />
//                                     <Button
//                                         className="w-1/4"
//                                         onClick={addExercise}
//                                     >
//                                         Add Exercise
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }