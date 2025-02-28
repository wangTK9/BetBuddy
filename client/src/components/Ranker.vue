<template>
  <div class="container_sadness_main">
    <div class="container_header-main-ranking">
      <div class="container-ranking-tag-button">
        <button @click="goBack">
          <!-- <i class="fas fa-arrow-left"></i> -->
        </button>
        <h2>Ranking</h2>
      </div>
      <div class="main_top-container">
        <div class="top-three">
          <div class="designer second-designer">
            <div class="tag">2</div>
            <img id="img-children" src="https://i.pinimg.com/736x/ec/43/7e/ec437ea3dbdf9980577c64eb7cb53c08.jpg" alt="Will Smith" />
            <h2>No Name</h2>
            <p>Wins: 0</p>
          </div>
          <div class="designer first-designer">
            <div class="tag">1</div>
            <img src="https://i.pinimg.com/736x/ec/43/7e/ec437ea3dbdf9980577c64eb7cb53c08.jpg" alt="Brad Pitt" />
            <h2>No Name</h2>
            <p>Wins: 0</p>
          </div>
          <div class="designer third-designer">
            <div class="tag">3</div>
            <img id="img-children" src="https://i.pinimg.com/736x/ec/43/7e/ec437ea3dbdf9980577c64eb7cb53c08.jpg" alt="Aaron Paul" />
            <h2>No Name</h2>
            <p>Wins: 0</p>
          </div>
        </div>
      </div>
      <div class="rank-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>User</th>
              <th>Win(%)</th>
              <th>Top 25%</th>
              <th>Wins</th>
            </tr>
          </thead>
          <!-- <tbody id="designer-list">
          </tbody> -->
          <tbody id="designer-list"> 
            <tr class="tr_content"> 
                <td><span class="rank-number">???</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Nguyễn Văn A" data-wins="9">Tuấn Kiệt</a></td> 
                <td>0%</td> 
                <td>0%</td> 
                <td>0</td> 
            </tr> 
            <tr class="tr_content"> 
                <td><span class="rank-number">???</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Nguyễn Văn A" data-wins="9">Thái Đăng</a></td> 
                <td>0%</td> 
                <td>0%</td> 
                <td>0</td> 
            </tr> 
            <!-- <tr class="tr_content"> 
                <td><span class="rank-number">5</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Trần Thị B" data-wins="9">Trần Thị B</a></td> 
                <td>45%</td> 
                <td>25%</td> 
                <td>3</td> 
            </tr> 
            <tr class="tr_content"> 
                <td><span class="rank-number">7</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Phạm Quốc D" data-wins="9">Phạm Quốc D</a></td> 
                <td>50%</td> 
                <td>10%</td> 
                <td>4</td> 
            </tr> 
            <tr class="tr_content"> 
                <td><span class="rank-number">8</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Đỗ Thanh E" data-wins="9">Đỗ Thanh E</a></td> 
                <td>45%</td> 
                <td>25%</td> 
                <td>2</td> 
            </tr> 
            <tr class="tr_content"> 
                <td><span class="rank-number">9</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Vũ Minh F" data-wins="9">Vũ Minh F</a></td> 
                <td>15%</td> 
                <td>10%</td> 
                <td>2</td> 
            </tr>
            <tr class="tr_content"> 
                <td><span class="rank-number">10</span></td> 
                <td><a href="javascript:void(0)" class="profile-link" data-name="Trần Thị Nở" data-wins="9">Trần Thị Nở</a></td> 
                <td>10%</td> 
                <td>10%</td> 
                <td>1</td> 
            </tr> -->
          </tbody>
        </table>
      </div>

      <!-- Trang Profile sẽ hiển thị khi nhấn vào User -->
      <div class="profile-page" id="profilePage">
        <h2>User Profile</h2>
        <p id="profileName"></p>
        <p id="profileWins"></p>
        <button @click="closeProfile">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    document.addEventListener('DOMContentLoaded', () => {
      const designers = [
        { name: 'Leonardo DiCaprio', winPercentage: '65%', top25: 15, totalWins: 9 },
        { name: 'Tom Hanks', winPercentage: '60%', top25: 13, totalWins: 8 },
        { name: 'Johnny Depp', winPercentage: '55%', top25: 12, totalWins: 7 },
        { name: 'Jack Nicholson', winPercentage: '50%', top25: 11, totalWins: 6 },
        { name: 'Al Pacino', winPercentage: '45%', top25: 10, totalWins: 5 },
        { name: 'Edward Norton', winPercentage: '40%', top25: 9, totalWins: 4 },
        { name: 'Gary Oldman', winPercentage: '35%', top25: 8, totalWins: 3 },
        { name: 'Ryan Reynolds', winPercentage: '30%', top25: 7, totalWins: 2 },
        { name: 'Liam Neeson', winPercentage: '25%', top25: 6, totalWins: 1 }
      ];

      const designerList = document.getElementById('designer-list');
      designers.forEach((designer, index) => {
        const row = document.createElement('tr');
        row.classList.add('tr_content'); // Thêm lớp này vào hàng
        row.innerHTML = `
          <td><span class="rank-number">${index + 1}</span></td>
          <td><a href="javascript:void(0)" class="profile-link" data-name="${designer.name}" data-wins="${designer.totalWins}">${designer.name}</a></td>
          <td>${designer.winPercentage}</td>
          <td>${designer.top25}</td>
          <td>${designer.totalWins}</td>
        `;
        designerList.appendChild(row);
      });

      const profileLinks = document.querySelectorAll('.profile-link');
      profileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const userName = e.target.getAttribute('data-name');
          const userWins = e.target.getAttribute('data-wins');
          document.getElementById('profileName').innerText = `Name: ${userName}`;
          document.getElementById('profileWins').innerText = `Wins: ${userWins}`;
          document.getElementById('profilePage').style.display = 'block';
        });
      });
    });
  },
  methods: {
    goBack() {
      // Thêm logic cho nút quay lại
    },
    closeProfile() {
      document.getElementById('profilePage').style.display = 'none';
    }
  }
};
</script>

<style scoped>
    .container_sadness_main {
      border-radius: 8px;
      display: flex;
      flex-direction: row;
      transition: width 0.3s ease;
      overflow: hidden;
      position: relative;
      border: 1px solid #ddd;
      height: 700px;
      
    }

    .container_header-main-ranking {
      width: 450px;
      background: linear-gradient(to top, #a3bded 0%, #6991c7 100%);
      height: auto;
      align-items: center;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 900px;
      border-radius: 10px;
    }

    .main_top-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 280px;
      background: linear-gradient(to top, #d5d9df 0%, #6991c7 100%);
      border-bottom-right-radius: 40px;
      border-bottom-left-radius: 40px;
      z-index: 10;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    }

    .container-ranking-tag-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      /* background-color: #25262E; */
      top: 0px;
      position: relative;
      z-index: 11;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .container-ranking-tag-button button {
      color: #ec4899;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .container-ranking-tag-button h2 {
      flex-grow: 1;
      text-align: center;
      margin: 0;
      color: white;
      /* margin-right: 50px; */
    }

    .container-ranking-tag-button button:focus {
      outline: none;
    }

    .container-ranking-tag-button button:active {
      background-color: #004085;
    }

    .top-three {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 120px;
      position: relative;
      z-index: 5;
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    .top-three .designer {
      text-align: center;
      width: 25%;
      padding: 15px;
      border-radius: 10px;
      transition: all 0.3s ease;
      position: relative;
    }

    .top-three .designer img {
      border-radius: 50%;
      /* margin-le: 50px; */
      width: 90px;
      height: 90px;
      border: 2px solid #2d2c46;
      transition: transform 0.3s ease;
    }

    #img-children {
      border-radius: 50%;
      width: 70px;
      height: 70px;
      border: 2px solid #2d2c46;
      transition: transform 0.3s ease;
    }

    .top-three .designer img:hover {
      transform: scale(1.1);
    }

    .top-three .designer h2 {
      color: #fff;
      font-size: 17px;
      margin-top: 10px;
    }

    .top-three .designer p {
      color: #d46868;
      font-size: 16px;
      font-weight: 700;
    }

    .first-designer {
      position: absolute;
      top: -60px;
      margin-right: 10p;
      z-index: 10;
    }
    .first-designer img {
      position: relative;
      right: 10px;
    }

    .first-designer .tag {
      background-color: #dcdcdc;
      color: #fff;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 10px;
      position: absolute;
      top: -20px;
      left: 55%;
      transform: translateX(-50%);
      background: linear-gradient(to top, #04dcbb 0%, #7ad5ff 100%);
    }
    .second-designer .tag,
    .third-designer .tag {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #dcdcdc;
    background: linear-gradient(to top, #8b1a1aa4 0%, #ace0f9 100%);

    color: #fff;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 10px;
    }

    .rank-table {
    position: relative;
    top: 10px;
    /* background-color: #2e2e38; */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    }

    table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    }

    th,
    td {
    padding: 15px;
    text-align: left;
    }

    th {
    /* background-color: #777777; */
    color: rgb(0, 0, 0);
    font-size: 16px;
    font-weight: 600;
    }

    td {
    color: #fff;
    font-size: 15px;
    }

    tr:nth-child(even) {
    /* background-color: #3a3a45; */
    }

    tr:hover {
    background-color: #7f8181;
    }

    tfoot {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    }

    tr td:first-child {
    text-align: center;
    padding: 10px;
    }

    .rank-number {
    color: white;
    font-weight: bold;
    font-size: 14px;
    background-color: #000000;
    padding: 2px 5px;
    border-radius: 3px;
    background: linear-gradient(to top, #424242 0%, #ace0f9 100%);

    }

    td:nth-child(2) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    }

    tr td {
    text-align: left;
    }

    .tr_content {
    border-radius: 20px;
    }

    .designer-list {
    /* Optional: add styles if needed */
    }

    .your-account {
    background-color: #1e1e2f;
    font-weight: bold;
    color: #ffcc00;
    }

    .your-account .rank-number {
    background-color: #ffcc00;
    color: #1e1e2f;
    }

    .your-account td {
    color: #ffcc00;
    }

    .profile-page {
    display: none; /* Chuyển thành block để hiển thị */
    position: absolute; /* Để đè lên các thẻ khác */
    top: 50%; /* Căn giữa theo chiều dọc */
    left: 50%; /* Căn giữa theo chiều ngang */
    transform: translate(-50%, -50%); /* Căn chính xác */
    margin-top: 0; /* Loại bỏ khoảng cách trên */
    text-align: left;
    padding: 20px;
    background-color: #ff1717;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 10000; /* Đảm bảo profile hiển thị trên các phần tử khác */
    
    }

    .profile-page h2 {
    text-align: center;
    color: #333;
    }

    .profile-page p {
    font-size: 16px;
    color: #555;
    }

    .profile-link {
    text-decoration: none;
    color: white;
    } 
</style>