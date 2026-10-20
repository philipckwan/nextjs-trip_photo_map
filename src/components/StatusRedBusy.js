export function StatusRedBusy() {
  return(
    <div className="border-2">
    <table>
      <tbody>
        <tr>
          <td><div className="w-5 h-5 bg-red-600 rounded-full"></div></td>
          <td>System is busy uploading photos, please wait for it to complete</td>
        </tr>                
      </tbody>
    </table>            
    </div>
  );
}

