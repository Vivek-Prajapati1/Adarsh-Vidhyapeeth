import Student from '../models/Student.js';

/**
 * Fix fee status for all students
 * This corrects any students that have wrong fee status
 * Runs automatically on server startup
 */
export const fixFeeStatus = async () => {
  try {
    console.log('🔧 Checking and fixing student fee statuses...');
    
    const students = await Student.find({ isDeleted: false });
    let updatedCount = 0;

    for (const student of students) {
      const oldStatus = student.feeStatus;
      let needsUpdate = false;
      
      // Ensure numeric values
      const feePaid = Number(student.feePaid) || 0;
      const totalFee = Number(student.totalFee) || 0;
      
      console.log(`  Checking ${student.name}: Paid=₹${feePaid}, Total=₹${totalFee}, Status=${oldStatus}`);
      
      // Recalculate correct fee status
      let correctStatus;
      if (feePaid > totalFee) {
        correctStatus = 'advanced';
      } else if (feePaid === totalFee && totalFee > 0) {
        correctStatus = 'paid';
        if (student.feeDue !== 0) {
          student.feeDue = 0;
          needsUpdate = true;
        }
      } else if (feePaid > 0) {
        correctStatus = 'partial';
      } else {
        correctStatus = 'due';
      }

      // Update if status is wrong
      if (oldStatus !== correctStatus) {
        student.feeStatus = correctStatus;
        // Recalculate feeDue
        student.feeDue = totalFee - feePaid;
        needsUpdate = true;
        console.log(`  ✓ Fixed ${student.name}: ${oldStatus} → ${correctStatus} (Extra: ₹${Math.abs(student.feeDue)})`);
      }

      if (needsUpdate) {
        await student.save();
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`✅ Fixed fee status for ${updatedCount} student(s)`);
    } else {
      console.log('✅ All student fee statuses are correct');
    }
  } catch (error) {
    console.error('❌ Error fixing fee statuses:', error);
  }
};
