export const PrintElem=(elem)=>
{
  var mywindow = window.open('', 'PRINT', 'height=400,width=600');

  mywindow.document.write('<html><head><style>' +
    'table {border-collapse: collapse;}  ' +
    'table, td, th {border: 1px solid black;text-align: left;} ' +
    'table td, table th {padding: 0 3px;}' +
    'input {border:none !important;} ' +
    '</style>');
  //mywindow.document.write('<link rel="stylesheet" type="text/css" href="../assets/print.css">');
  mywindow.document.write('</head>');
  mywindow.document.write('<body>'+elem.innerHTML+'</body>');
  mywindow.document.write('</html>');

  //let head  = document.getElementsByTagName('head')[0];
  //let link  = document.createElement('link');
  //link.rel  = 'stylesheet';
  //link.type = 'text/css';
  //link.href = '../assets/print.css';
  //link.media = 'all';
  //head.appendChild(link);

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
  mywindow.close();

  return true;
}
