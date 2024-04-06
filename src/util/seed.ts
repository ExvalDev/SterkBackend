import logger from "@/config/winston";
import MachineCategory from "@/models/MachineCategory";
import Role from "@/models/Role";
import Unit from "@/models/Unit";
import { Role as Roles } from "@/types/Role";

const seedInitialRoles = async () => {
  // Define your roles
  const roles = Object.values(Roles).map((role) => ({ name: role }));

  // Check if any roles already exist to avoid re-seeding data
  const count = await Role.count();
  if (count === 0) {
    // Use bulkCreate to insert initial roles if they don't already exist
    await Role.bulkCreate(roles);
    logger.info("Roles seeded successfully.");
  } else {
    logger.info("Roles already exist, skipping seeding.");
  }
};

const seedInitialUnits = async () => {
  const units = [
    { name: "Kilograms (Kg)" },
    { name: "Pounds (lbs)" },
    { name: "Miles" },
    { name: "Kilometers (Km)" },
    { name: "Meters (m)" },
    { name: "Centimeters (cm)" },
    { name: "Inches (in)" },
    { name: "Calories" },
    { name: "Heart Rate (beats per minute)" },
    { name: "Watts (W)" },
    { name: "Time (seconds, minutes, hours)" },
    { name: "Percentage of 1RM (%1RM)" },
    { name: "Body Mass Index (BMI)" },
    { name: "Body Fat Percentage (%)" },
    { name: "Lean Body Mass (Kg or lbs)" },
    { name: "Waist to Hip Ratio" },
    { name: "Circumferences (cm or in)" },
    { name: "Degrees (°)" },
    { name: "VO2 Max (ml/kg/min)" },
    { name: "Pace (minutes per km or mile)" },
    { name: "Stroke Rate (strokes per minute)" },
    { name: "Newton Meters (Nm)" },
    { name: "Pound-Feet (lb-ft)" },
    { name: "Velocity (m/s)" },
    { name: "Work to Rest Ratio" },
    { name: "Intervals" },
    { name: "Repetitions" },
    { name: "Sets" },
  ];

  // Check if any roles already exist to avoid re-seeding data
  const count = await Unit.count();
  if (count === 0) {
    // Use bulkCreate to insert initial roles if they don't already exist
    await Unit.bulkCreate(units);
    logger.info("Units seeded successfully.");
  } else {
    logger.info("Units already exist, skipping seeding.");
  }
};

const seedInitialMachineCategories = async () => {
  const machineCategories = [
    { name: "Bench Press Stations" },
    { name: "Dumbbells" },
    { name: "Cable Towers" },
    { name: "Squat Racks" },
    { name: "Leg Press Machines" },
    { name: "Smith Machines" },
    { name: "Pull-Up Bars" },
    { name: "Kettlebells" },
    { name: "Barbells" },
    { name: "Lat Pulldown Machines" },
    { name: "Leg Curl Machines" },
    { name: "Chest Fly Machines" },
    { name: "Shoulder Press Machines" },
    { name: "Leg Extension Machines" },
    { name: "Abdominal Crunch Machines" },
    { name: "Hyperextension Benches" },
    { name: "Preacher Curl Benches" },
    { name: "Roman Chairs" },
    { name: "Calf Machines" },
    { name: "Plate-Loaded Machines" },
    { name: "Functional Trainers" },
    { name: "Medicine Balls" },
    { name: "Plyo Boxes" },
    { name: "Battle Ropes" },
    { name: "Spin Bikes" },
    { name: "Rowing Machines" },
    { name: "Elliptical Trainers" },
    { name: "Treadmills" },
    { name: "Stair Climbers" },
    { name: "Recumbent Bikes" },
    { name: "Upright Bikes" },
    { name: "Vibration Platforms" },
    { name: "Suspension Trainers" },
    { name: "Climbing Ropes" },
    { name: "Gymnastic Rings" },
    { name: "Sandbags" },
    { name: "Resistance Bands" },
    { name: "Foam Rollers" },
  ];

  // Check if any machine categories already exist to avoid re-seeding data
  const count = await MachineCategory.count();
  if (count === 0) {
    // Use bulkCreate to insert initial machine categories if they don't already exist
    await MachineCategory.bulkCreate(machineCategories);
    logger.info("Machine categories seeded successfully.");
  } else {
    logger.info("Machine categories already exist, skipping seeding.");
  }
};

const seedData = async () => {
  seedInitialRoles();
  seedInitialUnits();
  seedInitialMachineCategories();
};

export default seedData;
